import { render, screen, waitFor } from "@testing-library/react-native";
import DinoExisted from "../../app/existed/[name1]";
import { mockedAxios } from "../../jest.setup";

const NAME = "Tyrannosaurus Rex";
const API_BASE_URL = "https://dinoapi.brunosouzadev.com/api/dinosaurs/";
const API_URL = `${API_BASE_URL}${encodeURIComponent(NAME)}`;

jest.mock("expo-router", () => ({
    useLocalSearchParams: jest.fn(() => ({ name1: NAME })),
}));

beforeEach(() => {
    mockedAxios.onGet(API_URL).reply(200, { name: NAME, existed: "68-66 million years ago" });
});

test("מציג מידע על קיום הדינוזאור", async () => {
    render(<DinoExisted />);

    await waitFor(() => expect(screen.findByText(new RegExp(NAME, 'i'))).toBeTruthy(), { timeout: 10000 });
    expect(screen.findByText(/68-66 million years ago/)).toBeTruthy();
});
