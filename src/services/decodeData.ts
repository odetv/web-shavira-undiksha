const decodeComplexData = (encodedData: string): object | null => {
  try {
    const decodedPayload = JSON.parse(atob(encodedData));
    const decodedValue = JSON.parse(
      decodeURIComponent(escape(atob(decodedPayload.value)))
    );
    return decodedValue;
  } catch (error) {
    console.error("Failed to decode cookie data:", error);
    return null;
  }
};

export default decodeComplexData;
