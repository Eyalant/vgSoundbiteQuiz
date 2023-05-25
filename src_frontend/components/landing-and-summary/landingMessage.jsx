import React from "react";
import { Card } from "react-bootstrap";

export function LandingMessage() {
    return (
        <Card id="landing-msg-card" className="text-white text-center">
            <br />
            <Card.Img data-testid="logo" id="logo" className="mx-auto" src="/public/assets/logo.png" />
            <Card.Body>
                <Card.Text className="lead text-white">
                    <span className="fw-bold">ברוכות הבאות וברוכים הבאים!</span>
                    <br />
                    לפניכם/ן 100 קטעי קול קצרצרים ממשחקים מפורסמים
                    בהיסטוריה. חלקם הם אפקטים קוליים, חלקם נעימות רקע
                    מוכרות וחלקם ציטוטים נבחרים.
                    <br />
                    אם זיהיתם/ן משחק,
                    פשוט הקלידו את שמו באנגלית (גם שם הסדרה זה בסדר).
                    אם התשובה נכונה, המשחק ייחשף והניקוד יתעדכן.
                    <br /><br />
                    אם אתם/ן מתקשים/ות בשאלה מסוימת וסקרנים/ות לגבי התשובה, אפשר לוותר על הניקוד שלה ולחשוף את התשובה מיידית.
                    <br />
                    כשתסיימו, כדי לסכום את הניקוד ולחשוף בבת אחת את התשובות לכל השאלות, לחצו על "סיימתי!" בתחתית הדף.
                    <br /><br />
                    בהצלחה &#128151;
                </Card.Text>
            </Card.Body>
        </Card>
    );
}