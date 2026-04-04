import pool from "../config/connection.js"

export async function getLastWeekJournal(userId,days) {
  const query = `
    SELECT content, created_at
    FROM journals
    WHERE user_id = $1
    AND created_at >= NOW() - ($2 * INTERVAL '1 days')
    ORDER BY created_at DESC
  `;
 console.log("days",days)
  const result = await pool.query(query, [userId,Number(days)]);
  console.log("tool",result)
  return result.rows;
}