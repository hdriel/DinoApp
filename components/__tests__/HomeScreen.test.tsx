import { render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "../../app/(tabs)/index";
import { mockedAxios } from "../../jest.setup";
const API_URL = "https://dinoapi.brunosouzadev.com/api/dinosaurs";

beforeEach(() => {
    mockedAxios.onGet(API_URL).reply(200, [
        { _id: "1", name: "Brachiosaurus" },
        { _id: "2", name: "Stegosaurus" },
    ]);
});

afterEach(() => {
    jest.clearAllMocks();
});

// ✅ בדיקה שהרשימה של הדינוזאורים מוצגת נכון
test("מציג רשימת דינוזאורים", async () => {
    render(<HomeScreen />);

    await waitFor(() => {
        expect(screen.getByText(/Brachiosaurus/i)).toBeTruthy();
        expect(screen.getByText(/Stegosaurus/i)).toBeTruthy();
    }, { timeout: 20000 });

}, 25000);
