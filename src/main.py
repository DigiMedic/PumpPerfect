from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Aplikace běží správně."}

@app.get("/favicon.ico")
async def favicon():
    return {"message": "Favicon not found"} 