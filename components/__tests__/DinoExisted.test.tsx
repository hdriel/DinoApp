import { render, screen, waitFor } from "@testing-library/react-native";
import DinoExisted from "../../app/existed/[name1]";
import axios from "axios";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
        data: { name: "Tyrannosaurus Rex", existed: "68-66 million years ago" },
    });
});

test("מציג מידע על קיום הדינוזאור", async () => {
    render(<DinoExisted />);

    await waitFor(() => expect(screen.getByText("Tyrannosaurus Rex")).toBeTruthy(), { timeout: 10000 });
    expect(screen.getByText(/68-66 million years ago/)).toBeTruthy();
});
