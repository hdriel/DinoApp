import { render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "../../app/(tabs)/index";
import axios from "axios";

// ✅ Mock ל- `axios`
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
        data: [
            { _id: "1", name: "Brachiosaurus" },
            { _id: "2", name: "Stegosaurus" },
        ],
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

// ✅ בדיקה שהרשימה של הדינוזאורים מוצגת נכון
test("מציג רשימת דינוזאורים", async () => {
    render(<HomeScreen />);

    await waitFor(() => {
        expect(screen.getByText("Brachiosaurus")).toBeTruthy();
        expect(screen.getByText("Stegosaurus")).toBeTruthy();
    }, { timeout: 20000 });
}, 25000);
