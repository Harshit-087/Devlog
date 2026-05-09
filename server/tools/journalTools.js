import prisma from "../config/connection.js"

export async function getLastWeekJournal(userId,days) {
//   const query = `
//     SELECT content, created_at
//     FROM journals
//     WHERE user_id = $1
//     AND created_at >= NOW() - ($2 * INTERVAL '1 days')
//     ORDER BY created_at DESC
//   `;
//  console.log("days",days)
  const result = await prisma.journals.findMany({
    where: {
      user_id: Number(userId),
      created_at: {
        gte: new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000)
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
  console.log("tool",result)
  return result;
}