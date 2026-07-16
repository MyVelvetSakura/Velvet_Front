export function getCardsFromState(state) {
  if (!state) return null;

  const { past, present, future } = state;

  return [
    { ...past, stage: "Pasado" },
    { ...present, stage: "Presente" },
    { ...future, stage: "Futuro" },
  ];
}

export function getNextIndex(current) {
  return current === 2 ? 0 : current + 1;
}

export function getPrevIndex(current) {
  return current === 0 ? 2 : current - 1;
}

export function shouldShowActions(isMobile, stage) {
  return !isMobile || (isMobile && stage === "Futuro");
}

export function buildReadingData({ user, readingName, past, present, future }) {
  if (!readingName?.trim()) {
    throw new Error("Reading name is required");
  }

  return {
    userId: user?.id,
    id: "test-id",
    date: "test-date",
    name: readingName,
    pastCardId: past.id,
    presentCardId: present.id,
    futureCardId: future.id,
  };
}
