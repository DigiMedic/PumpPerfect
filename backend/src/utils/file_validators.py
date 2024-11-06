import pandas as pd
from typing import Dict, Any

def validate_file_structure(df: pd.DataFrame, structure: Dict[str, Any]) -> None:
    """Validace struktury CSV souboru"""
    missing_columns = [col for col in structure['columns'] if col not in df.columns]
    if missing_columns:
        raise ValueError(
            f"Chybějící povinné sloupce: {', '.join(missing_columns)}"
        )
