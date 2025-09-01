import { TIMEOUT_SECONDS } from "./config";

const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Please try again later.`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} , ${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};