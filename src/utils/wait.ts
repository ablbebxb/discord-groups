export async function waitForCondition(condition: () => boolean) {
  if (condition()) {
    return;
  }

  let interval: NodeJS.Timer;
  try {
    await new Promise((res) => {
      interval = setInterval(() => {
        if (condition()) {
          res('wait condition met');
        }
      }, 500);
    });
  } finally {
    clearInterval(interval);
  }
}
