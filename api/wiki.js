export default async function handler(req, res) {
    // 取得前端傳來的關鍵字
    const keyword = req.query.keyword;
    
    if (!keyword) {
        return res.status(400).json({ error: "請提供搜尋關鍵字" });
    }

    // 準備向灰機 Wiki 發送請求
    const baseUrl = "https://ff14.huijiwiki.com/api.php";
    const params = new URLSearchParams({
        action: "query",
        format: "json",
        prop: "extracts",
        exintro: "",
        explaintext: "",
        titles: keyword
    });

    try {
        // 伺服器對伺服器發送請求，完美繞過 CORS！
        // 加上 User-Agent 偽裝成正常瀏覽器，避免被 Cloudflare 阻擋
        const response = await fetch(`${baseUrl}?${params.toString()}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        
        const data = await response.json();
        
        // 將抓到的資料回傳給我們自己的前端
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "伺服器抓取失敗" });
    }
}
