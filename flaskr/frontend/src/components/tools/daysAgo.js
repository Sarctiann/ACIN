const daysAgo = (today, date) => {
    const delta = ((today - date) / (1000 * 3600 * 24)).toFixed()
    let label
    switch (delta) {
        case '0':
        case '-0':
            label = 'Today'
            break
        case '1':
            label = 'Yesterday'
            break
        default:
            label = `${delta} days ago`
            break
    }
    return label
}

export default daysAgo