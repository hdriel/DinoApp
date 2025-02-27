import { render, screen, waitFor } from "@testing-library/react-native";
import DinosaurDetails from "../../components/DinosaurDetails";
import axios from "axios";

// ✅ תיקון: שימוש נכון ב-Mock של Axios
jest.mock("axios");
jest.setTimeout(30000);

const mockedAxios = axios as jest.Mocked<typeof axios>;

// ✅ חוסם לוגים
beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => { });
    jest.spyOn(console, "warn").mockImplementation(() => { });
    jest.spyOn(console, "error").mockImplementation(() => { });

    mockedAxios.get.mockResolvedValue({
        data: {
            name: "Tyrannosaurus Rex",
            diet: "Carnivore",
            period: "Cretaceous",
            region: "North America",
            description: "One of the most famous dinosaurs.",
            image: "https://example.com/t-rex.jpg",
        },
    });
});

afterEach(() => {
    jest.clearAllTimers();
    jest.resetAllMocks();
});

// ✅ בדיקה של טעינת שם הדינוזאור
test("מציג את שם הדינוזאור ותיאורו", async () => {
    render(<DinosaurDetails name="Tyrannosaurus Rex" />);

    await waitFor(() => expect(screen.getByText("Tyrannosaurus Rex")).toBeTruthy(), { timeout: 10000 });
    expect(screen.getByText(/Carnivore/)).toBeTruthy();
    expect(screen.getByText(/Cretaceous/)).toBeTruthy();
    expect(screen.getByText(/North America/)).toBeTruthy();
});

// ✅ בדיקה של טעינת תמונת הדינוזאור
test("בודק אם יש תמונה לדינוזאור", async () => {
    render(<DinosaurDetails name="Tyrannosaurus Rex" />);

    const image = await waitFor(() => screen.getByRole("image"), { timeout: 10000 });
    expect(image).toBeTruthy();
});
