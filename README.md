# Operation IronSwords

## 🇮🇱 מערכת כרטיסי סיוע לקהל וניהול מלאי לקהילה 🇮🇱

### עברית:

באור המלחמה הרותחת, חרבות ברזל, אנו מפתחים מערכת לספק תמיכה חשובה לקהלות שלנו בתקופות קריטיות כאלה. פרויקט זה, הפתוח לקוד, מכוון ליצירת אפליקציה אינטרנטית שתקל על הלוגיסטיקה בין מלונות/מקומות, מתנדבים ומחסנים בעיר. לכל מלון או מקום יש מערכת כרטיסים שבה המפעילים יכולים ליצור, לנהל ולפתור כרטיסים הקשורים לבקשות סיוע או הפצת מידע. בנוסף, המערכת מנהלת מלאי במחסנים שונים, וממיינת פריטים כמו בגדים, מוצרי היגיינה, מזון ומשחקים לילדים. על ידי עידוד תקשורת יעילה וחלוקת סיוע, יוזמה זו מבטיחה סיוע מהיר ויעיל לאלה הזקוקים לו בתקופות סוערות. התרומות והתמיכה שלכם במטרה זו מוערכות ביותר.

#### תמיכה בפרויקט שלנו:

התמיכה שלכם חשובה במיוחד כדי ליצור הבדל בחיים של רבים. אם זה על ידי תרומת קוד, דיווח על באגים, או הפצת המילה על הפרויקט הזה, כל תרומה קטנה עוזרת. יחד, אנו יכולים לבנות מערכת שבאמת מייצגת קהילה, סולידריות, וסיוע.

### English:

In light of the on-going war, IronSwords, we are developing a system to provide pivotal support to our communities during such critical times. This open-source project is aimed at creating a web application to facilitate logistics among hotels/locations, volunteers, and warehouses within a city. Each hotel or location operates a ticketing system where operators can create, manage, and resolve tickets regarding aid requests or information dissemination. Furthermore, the system manages inventory across different warehouses, categorizing items like clothing, hygiene products, food, and children's games. By enhancing communication and aid distribution, this initiative ensures prompt and effective assistance to those in need during turbulent times. Your contributions and support towards this cause are highly appreciated.

#### Supporting our project:

Your support is invaluable in making a difference in the lives of many. Whether it's by contributing code, reporting bugs, or spreading the word about this project, every bit helps. Together, we can build a system that truly stands for community, solidarity, and aid.

---

## עברית:

### הוראות תרומה והתחלה

#### איך להתחיל:

1. הורידו את הפרויקט למחשב שלכם.
2. הריצו את הפקודה `bun install` להתקנת התלויות.
3. כדי להתחבר ל-PlanetScale, עקבו אחר ההוראות הנתונות [כאן](https://planetscale.com/).
4. הגדירו את Google Cloud OAuth על פי ההוראות שנמצאות [כאן](https://next-auth.js.org/providers/google).
5. התקינו את Vercel ואת Google Cloud על פי ההוראות שבאתרים הבאים: [Vercel](https://vercel.com/) ו- [Google Cloud](https://cloud.google.com/?hl=en).
6. העתיקו את הערכים הנדרשים לקובץ `.env` מהדוגמה שמסופקת בפרויקט.

#### הגשת תרומות:

אנא הגישו PR עם התווית `feat/<שם העמוד | תכונת אבטחה>` ואנו נמזג אותו בהקדם האפשרי.
אל תהססו ליצור קשר!

## דפים חסרים:

- [ ] לוח בקרה ליצירת מיקום
- [ ] לוח בקרה ליצירת מפעיל
- [ ] לוח בקרה ליצירת מחסן
- [ ] לוח בקרה של המחסן
- [ ] לוח בקרה לבקשות החיילים מצה"ל

## תכונות אבטחה חסרות:

- [ ] מנגנון הגבלת שיעור
- [ ] נעילת אזור (Cloudflare?)
- [ ] הגנה מפני בוטים
- [ ] הצפנת נתונים נוספת.

---

## English:

### Contribution Guidelines and Getting Started

#### How to Start:

1. Clone the project to your local machine.
2. Run the command `bun install` to install the dependencies.
3. For connecting to PlanetScale, follow the guidelines provided [here](https://planetscale.com/).
4. Set up Google Cloud OAuth using the instructions found [here](https://next-auth.js.org/providers/google).
5. Install and set up Vercel and Google Cloud following the guidelines on their respective websites: [Vercel](https://vercel.com/) and [Google Cloud](https://cloud.google.com/?hl=en).
6. Copy the required values into your `.env` file from the sample provided in the project.

#### Contributing:

Please open a PR with the label `feat/<page-name | security-feature>` and we will merge it as soon as possible.
Feel free to connect!

---

## Missing Pages:

- [ ] Location creation dashboard
- [ ] Operator creation dashboard
- [ ] Warehouse creation dashboard
- [ ] Warehouse dashboard
- [ ] IDF Soldiers request dashboard

## Missing Security Features:

- [ ] Ratelimiter
- [ ] Region Lock (Cloudflare ?)
- [ ] Bot Protection
- [ ] Additional data encryption.

Any additional community suggestions are welcomed :)

Guide to contribute, open a PR with a feat/<page-name | security-feature>
And we will merge it as soon as possible!
Feel free to connect.
