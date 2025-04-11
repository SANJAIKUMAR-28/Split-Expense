export const formatISTDate = (isoString) => {
    const date = new Date(isoString);

    const day = date.getDate();
    const daySuffix = 
        day === 1 || day === 21 || day === 31 ? "st" :
        day === 2 || day === 22 ? "nd" :
        day === 3 || day === 23 ? "rd" : "th";

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
    }).format(date);

    const [d, time] = formattedDate.split("at");
    const [dayNum, month, year] = d.split(" ");
    
    return `${dayNum}${daySuffix} ${month} ${year} - ${time}`;
};
