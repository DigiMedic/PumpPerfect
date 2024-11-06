import pytest
from fastapi.testclient import TestClient
from src.main import app
import os
import pandas as pd
from io import StringIO

client = TestClient(app)

def create_test_csv():
    """Vytvoření testovacího CSV souboru"""
    cgm_data = """Name:Date Range:2024-06-02 - 2024-07-01
Timestamp,CGM Glucose Value (mmol/l),Serial Number
2024-07-01 21:54,10.5,935953
2024-07-01 21:49,10.5,935953
2024-07-01 21:44,11.1,935953"""
    
    with open("test_cgm_data.csv", "w") as f:
        f.write(cgm_data)
    return "test_cgm_data.csv"

def test_upload_file():
    """Test nahrání souboru"""
    filename = create_test_csv()
    
    with open(filename, "rb") as f:
        response = client.post(
            "/api/upload/files",
            files={"files": (filename, f, "text/csv")}
        )
    
    assert response.status_code == 200
    assert "session_id" in response.json()
    
    # Cleanup
    os.remove(filename)

def test_glucose_overview():
    """Test získání přehledu glykémie"""
    # Nejdřív nahrajeme soubor
    filename = create_test_csv()
    
    with open(filename, "rb") as f:
        response = client.post(
            "/api/upload/files",
            files={"files": (filename, f, "text/csv")}
        )
    
    session_id = response.json()["session_id"]
    
    # Pak získáme přehled
    response = client.get(f"/api/analysis/{session_id}/glucose-overview")
    
    assert response.status_code == 200
    data = response.json()
    assert "cgm" in data
    assert "time_in_range" in data
    
    # Cleanup
    os.remove(filename)
