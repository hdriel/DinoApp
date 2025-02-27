import { render, screen, waitFor } from "@testing-library/react-native";
import DinosaurDetails from "../../components/DinosaurDetails";
import { mockedAxios } from "../../jest.setup";

// 🔍 ניקוי השם והדפסתו
const formattedName = name => name.trim().toLowerCase().replace(/\s+/g, " ");
const API_BASE_URL = "https://dinoapi.brunosouzadev.com/api/dinosaurs/";
const NAME = 'Tyrannosaurus Rex';
const API_URL = `${API_BASE_URL}${encodeURIComponent(formattedName(NAME))}`
console.log('API_URL', API_URL)


describe('הדינוזאור ותיאורו', () => {
    // ✅ חוסם לוגים
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        jest.spyOn(console, "warn").mockImplementation(() => { });
        jest.spyOn(console, "error").mockImplementation(() => { });

        mockedAxios.onGet(API_BASE_URL).reply(200, [
            { _id: "1", name: NAME },
            { _id: "2", name: "Stegosaurus" },
        ]);

        mockedAxios.onGet(API_URL).reply(200, [
            {
                name: NAME,
                diet: "Carnivore",
                period: "Cretaceous",
                region: "North America",
                description: "One of the most famous dinosaurs.",
                image: "https://example.com/t-rex.jpg",
            }
        ]);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.resetAllMocks();
    });

    // ✅ בדיקה של טעינת שם הדינוזאור
    test("מציג את שם הדינוזאור ותיאורו", async () => {
        render(<DinosaurDetails name={NAME} />);

        await waitFor(() => expect(screen.findByText(new RegExp(NAME, 'i'))).toBeTruthy(), { timeout: 10000 });
        expect(screen.findByText(/Carnivore/i)).toBeTruthy();
        expect(screen.findByText(/Cretaceous/i)).toBeTruthy();
        expect(screen.findByText(/North America/i)).toBeTruthy();
    });



    // ✅ בדיקה של טעינת תמונת הדינוזאור
    test("בודק אם יש תמונה לדינוזאור", async () => {
        render(<DinosaurDetails name={NAME} />);

        const image = await waitFor(() => screen.getByTestId(`image-${NAME}`), { timeout: 10000 });
        expect(image).toBeTruthy();
    });

})