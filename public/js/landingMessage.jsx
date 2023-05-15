function LandingMessage() {
    return (
        <Card id="landing-msg-card" className="text-white text-center">
            <br />
            <Card.Img id="logo" className="mx-auto" src="/public/assets/logo.png" />
            <Card.Body>
                <Card.Text className="lead text-white">
                    <p className="fw-bold">ברוכים הבאים!</p>
                    לפניכם 100 קטעי קול קצרצרים ממשחקים מפורסמים
                    בהיסטוריה. חלקם הם אפקטים קוליים, חלקם נעימות רקע
                    מוכרות וחלקם ציטוטים נבחרים.
                    <br />
                    אם זיהיתם משחק,
                    פשוט הקלידו את שמו באנגלית (גם שם הסדרה זה בסדר).
                    אם התשובה נכונה, המשחק ייחשף והניקוד שלכם יתעדכן.<br />
                    כשתסיימו, כדי לסכום את הניקוד, הקליקו על הכפתור האדום כאן למטה.
                    <br /><br />
                    בהצלחה :)
                </Card.Text>
            </Card.Body>
        </Card>
    );
}