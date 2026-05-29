import json
import re
import sys
from pathlib import Path
from eyepop import EyePopSdk
from eyepop.worker.worker_types import InferenceComponent, Pop

# LOAD VARIABLE 

import os
from dotenv import load_dotenv
load_dotenv('../.env.local')

EYEPOP_API_KEY = os.getenv('EYEPOP_API_KEY')
ABILITY_NAME = os.getenv("ABILITY_NAME")

# EYEPOP:
pop = Pop(components=[
    InferenceComponent(ability=ABILITY_NAME)
])

# Grabbing path from the command line arg
img_path = sys.argv[1]  

# ENDP
with EyePopSdk.workerEndpoint(api_key=EYEPOP_API_KEY) as endpoint:
    endpoint.set_pop(pop)
    job = endpoint.upload(Path(img_path))
    while result := job.predict():
        raw_text = result['texts'][0]['text']
        clean = re.sub(r'```json|```', '', raw_text).strip()
        nutrition = json.loads(clean)
        # single line output for parsing
        print(json.dumps(nutrition))  