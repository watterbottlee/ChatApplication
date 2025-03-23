export function formatTimestamp(dateString) {
    if (!dateString) return "N/A"; // Handle null values

    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24h to 12h format

    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

// Example usage
console.log(formatTimestamp("2024-03-03T14:30:00Z")); // 2:30 PM
