import { dashboardParser, weeklyParser } from "../agent/weekly.parser.js";
import { llm } from "../config/ai.js";

export async function analyzeJournal(entries) {
    const formatInstructions = weeklyParser.getFormatInstructions();
  const prompt = `
Analyze these developer journal entries.
title should be keyword from the input entries title .

Find:
1.title suitable for the processing
2. Weekly summary
3. Skills learned
4. Missing learning gaps
5. Recommended next topics


No markdown.
No explanation.
Return concise JSON.
Return ONLY valid JSON:
{
  "title":""
  "summary": "",
  "skills": [],
  "gaps": [],
  "recommendations": []
}
Entries:
${JSON.stringify(entries)}

${formatInstructions}
`;

  const response = await llm.invoke(prompt);
const cleanText = response.content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const parsed = await weeklyParser.parse(cleanText);
console.log("chain",parsed)
  return parsed;
}


export async function dashboard_journalAnalysis(entries){
    const fromatInstruction = dashboardParser.getFormatInstructions()
    const prompt=`
    Analyze all the user input journal entries,
    and 
    focus ,include the user current working area example category are: backend architecture,or frontend or devops , or sales  etc . these example are for reference purpose ,you have to find the top most frequent category user inputs top atmost 3. 
   

    progress calculate the progress by analyzing the topic which specified the most is most progressed and give a number based on the depth of the  topic is intruduced and add all the mentioned topic as a josn object the highest valued at front (descending order) 
    -progress always a object key are the topic and the values are they score which u give .

    find this: 
    1.focus
    2.progress
  
    RETURN in json format
    {
      "focus":[],
      "progress":{}
    }
    
    No markdown.
    No explanation.


    entries:
    ${JSON.stringify(entries)}
    ${fromatInstruction}
    `

    const response =await  llm.invoke(prompt)
   const cleanText = response.content
   .replace(/```json/g,"")
   .replace(/```/g,"")
   .trim()

   const parsed = await dashboardParser.parse(cleanText);
    return parsed;

}