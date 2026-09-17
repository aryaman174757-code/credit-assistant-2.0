from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, DocumentRecord, Transaction
from app.schemas.schemas import OCRUploadResponse, OCRParsedTransaction
from app.services.ocr_service import OCRDocumentService
from app.services.security_service import SecurityService

router = APIRouter(prefix="/ocr", tags=["OCR Document Center"])

@router.post("/upload", response_model=OCRUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        contents = await file.read()
        file_size = len(contents)
        
        # Extract text from uploaded content
        try:
            raw_text = contents.decode("utf-8", errors="ignore")
        except Exception:
            raw_text = ""
            
        extracted_txns_raw = OCRDocumentService.parse_statement_text(raw_text)
        
        doc_record = DocumentRecord(
            user_id=user.id,
            filename=file.filename,
            file_type=file.content_type or "application/octet-stream",
            file_size=file_size,
            document_type="Bank Statement",
            status="Processed",
            extracted_transactions_count=len(extracted_txns_raw),
            parsed_metadata={"transactions": extracted_txns_raw}
        )
        db.add(doc_record)
        db.commit()
        db.refresh(doc_record)
        
        SecurityService.log_audit(db, user.id, "OCR_STATEMENT_UPLOADED", details=f"Parsed {len(extracted_txns_raw)} transactions from {file.filename}")
        
        parsed_models = [
            OCRParsedTransaction(
                date=t["date"],
                merchant=t["merchant"],
                amount=t["amount"],
                category=t["category"],
                type=t["type"]
            )
            for t in extracted_txns_raw
        ]
        
        preview_text = raw_text[:500] if len(raw_text) > 0 else f"Parsed statement file '{file.filename}' ({file_size} bytes). Extracted {len(extracted_txns_raw)} structured line items."
        
        return {
            "document_id": doc_record.id,
            "filename": file.filename,
            "document_type": doc_record.document_type,
            "status": "Processed",
            "total_extracted": len(parsed_models),
            "extracted_transactions": parsed_models,
            "raw_preview_text": preview_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@router.post("/confirm-import/{doc_id}")
def confirm_import(
    doc_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(DocumentRecord).filter(DocumentRecord.id == doc_id, DocumentRecord.user_id == user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document record not found")
        
    txns = doc.parsed_metadata.get("transactions", [])
    imported_count = 0
    for t in txns:
        txn = Transaction(
            user_id=user.id,
            amount=t["amount"],
            merchant=t["merchant"],
            category=t["category"],
            type=t["type"],
            payment_mode="Bank Transfer",
            source="ocr",
            date=datetime.utcnow()
        )
        db.add(txn)
        imported_count += 1
        
    db.commit()
    SecurityService.log_audit(db, user.id, "OCR_TXNS_COMMITTED", details=f"Committed {imported_count} OCR transactions into ledger")
    return {"status": "success", "imported_count": imported_count, "message": f"Successfully imported {imported_count} transactions into expense ledger"}
