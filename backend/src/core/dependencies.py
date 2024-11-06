from src.services.file_processor import FileProcessor
from src.services.data_analyzer import DataAnalyzer

def get_file_processor() -> FileProcessor:
    return FileProcessor()

def get_data_analyzer() -> DataAnalyzer:
    return DataAnalyzer()
