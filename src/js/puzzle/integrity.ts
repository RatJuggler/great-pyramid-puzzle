
type IntegrityCheckResult = [boolean, string];

interface IntegrityCheck {
    integrityCheck: () => IntegrityCheckResult;
}

export { IntegrityCheck, IntegrityCheckResult }
