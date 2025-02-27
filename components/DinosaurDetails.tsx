import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://dinoapi.brunosouzadev.com/api/dinosaurs/";

export default function DinosaurDetails({ name }: { name: string }) {
    const [dino, setDino] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDinoDetails() {
            try {
                if (!name || typeof name !== "string") {
                    setError("⚠️ שם דינוזאור לא תקין!");
                    setLoading(false);
                    return;
                }

                // ✅ שלב 1: הדפסת כל השמות מה-API (כדי לראות איך הם רשומים בפועל)
                const allDinosResponse = await axios.get(API_BASE_URL);
                const allDinos = allDinosResponse.data;
                console.log("🦖 כל השמות מה-API:");
                allDinos.forEach((d) => console.log(`"${d.name}" (אורך: ${d.name.length})`));

                // 🔍 ניקוי השם והדפסתו
                const formattedName = name.trim().toLowerCase().replace(/\s+/g, " ");
                console.log(`📡 מחפש דינוזאור בשם: "${formattedName}" (אורך: ${formattedName.length})`);

                // 🔍 שליחת השם המעובד ל-API
                const response = await axios.get(`${API_BASE_URL}${encodeURIComponent(formattedName)}`);

                console.log("📩 תגובת ה-API:", response.data);

                if (!response.data || response.data.length === 0) {
                    console.warn(`⚠ אין נתונים לדינוזאור: "${formattedName}"`);
                    setError(`❌ הדינוזאור הזה לא קיים זמנית 🦖`);
                    setDino(null);
                } else {
                    setDino(response.data[0]); // ✅ בחירת הפריט הראשון
                }
            } catch (err) {
                setError("🚨 שגיאה בשליפת הנתונים");
                console.error("❌ שגיאת API:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDinoDetails();
    }, [name]);

    if (loading)
        return <p style={{ textAlign: "center", fontSize: "18px" }}>⏳ טוען נתונים...</p>;

    if (error)
        return (
            <div style={{
                textAlign: "center",
                padding: "20px",
                color: "white",
                backgroundColor: "red",
                borderRadius: "10px",
                fontSize: "18px",
                fontWeight: "bold"
            }}>
                🚨 {error} 🦖
            </div>
        );

    if (!dino)
        return (
            <div style={{
                textAlign: "center",
                padding: "20px",
                color: "white",
                backgroundColor: "blue",
                borderRadius: "10px",
                fontSize: "18px",
                fontWeight: "bold"
            }}>
                🔍 הדינוזאור הזה לא קיים זמנית 🦕
            </div>
        );

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>{dino.name || <span style={{ color: "red" }}>❌ אין שם</span>}</h1>

            {dino.image ? (
                <img src={dino.image} alt={dino.name} style={{ width: "300px", height: "auto", borderRadius: "10px" }} />
            ) : (
                <p style={{ color: "gray", fontWeight: "bold" }}>🖼 אין תמונה</p>
            )}

            <p><strong>משקל:</strong> {dino.weight || "N/A"}</p>
            <p><strong>גובה:</strong> {dino.height || "N/A"}</p>
            <p><strong>אורך:</strong> {dino.length || "N/A"}</p>
            <p><strong>תזונה:</strong> {dino.diet || "N/A"}</p>
            <p><strong>תקופה:</strong> {dino.period || "N/A"}</p>
            <p><strong>קיום:</strong> {dino.existed || "N/A"}</p>
            <p><strong>אזור:</strong> {dino.region || "N/A"}</p>

            <p>
                <strong>תיאור:</strong>{" "}
                {dino.description ? dino.description : <span style={{ color: "orange" }}>⚠ אין תיאור זמין</span>}
            </p>
        </div>
    );
}
