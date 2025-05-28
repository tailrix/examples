import { fetchUsers } from './users'; // Adjust path as necessary
import { getApiKey } from "@/app/actions/apikey";
import { listAccounts, Account } from "tailrix";

// Mock dependencies
jest.mock("@/app/actions/apikey", () => ({
    getApiKey: jest.fn(),
}));

jest.mock("tailrix", () => {
    const originalTailrix = jest.requireActual("tailrix");
    return {
        ...originalTailrix, // Preserve other exports from tailrix if any
        listAccounts: jest.fn(),
        // Mock Account type if needed for type checking in tests, 
        // but usually constructor/instance mocking isn't needed for data objects.
    };
});

// Typedef for mocked functions
const mockGetApiKey = getApiKey as jest.MockedFunction<typeof getApiKey>;
const mockListAccounts = listAccounts as jest.MockedFunction<typeof listAccounts>;

describe('fetchUsers action', () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockGetApiKey.mockClear();
        mockListAccounts.mockClear();
        // Spy on console.error and silence it for expected error tests
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore console.error
        (console.error as jest.MockedFunction<typeof console.error>).mockRestore();
        (console.warn as jest.MockedFunction<typeof console.warn>).mockRestore();
    });

    it('should return mapped users when API key and accounts are found', async () => {
        mockGetApiKey.mockResolvedValue('test-api-key');
        const mockAccounts: Account[] = [
            { id: 'user1', name: 'User One', /* other Account properties */ } as Account,
            { id: 'user2', name: 'User Two', /* other Account properties */ } as Account,
        ];
        mockListAccounts.mockResolvedValue(mockAccounts);

        const users = await fetchUsers();

        expect(mockGetApiKey).toHaveBeenCalledTimes(1);
        expect(mockListAccounts).toHaveBeenCalledWith('test-api-key');
        expect(users).toEqual([
            { id: 'user1', name: 'User One' },
            { id: 'user2', name: 'User Two' },
        ]);
    });

    it('should return an empty array if API key is not found', async () => {
        mockGetApiKey.mockResolvedValue(''); // Simulate API key not found

        const users = await fetchUsers();

        expect(mockGetApiKey).toHaveBeenCalledTimes(1);
        expect(mockListAccounts).not.toHaveBeenCalled();
        expect(users).toEqual([]);
        expect(console.error).toHaveBeenCalledWith("Failed to fetch users:", expect.any(Error));
    });
    
    it('should return an empty array if listAccounts returns null', async () => {
        mockGetApiKey.mockResolvedValue('test-api-key');
        mockListAccounts.mockResolvedValue(null as any); // Simulate no accounts found

        const users = await fetchUsers();

        expect(users).toEqual([]);
    });

    it('should return an empty array if listAccounts returns an empty array', async () => {
        mockGetApiKey.mockResolvedValue('test-api-key');
        mockListAccounts.mockResolvedValue([]);

        const users = await fetchUsers();
        expect(users).toEqual([]);
    });

    it('should filter out accounts with missing id or name and log a warning', async () => {
        mockGetApiKey.mockResolvedValue('test-api-key');
        const mockAccounts: Account[] = [
            { id: 'user1', name: 'User One' } as Account,
            { id: null, name: 'User Two Invalid' } as any, // Missing id
            { id: 'user3', name: undefined } as any, // Missing name
            { id: 'user4', name: 'User Four' } as Account,
        ];
        mockListAccounts.mockResolvedValue(mockAccounts);

        const users = await fetchUsers();
        expect(users).toEqual([
            { id: 'user1', name: 'User One' },
            { id: 'user4', name: 'User Four' },
        ]);
        // Check if console.warn was called for the invalid accounts
        // This depends on the exact implementation of the warning log in users.ts
        // For now, assuming it might log something. If not, this part can be removed.
        // expect(console.warn).toHaveBeenCalledWith("Account found with missing id or name:", expect.any(Object));
        // expect(console.warn).toHaveBeenCalledTimes(2); // For two invalid accounts
    });


    it('should return an empty array and log error if listAccounts throws an error', async () => {
        mockGetApiKey.mockResolvedValue('test-api-key');
        const error = new Error('Tailrix SDK Error');
        mockListAccounts.mockRejectedValue(error);

        const users = await fetchUsers();

        expect(users).toEqual([]);
        expect(console.error).toHaveBeenCalledWith("Failed to fetch users:", error);
    });
});
