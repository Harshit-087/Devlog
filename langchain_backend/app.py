from langchain import OpenAI
from dotenv import load_dotenv


load_dotenv()

model = OpenAI(
    model="openai/gpt-oss-120b",
    baseurl="https://api.groq.com/openai/v1"
)

result = model.invoke()