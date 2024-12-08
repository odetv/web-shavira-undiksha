const encodeComplexData = (data: object): string => {
  const payload = {
    iv: btoa(unescape(encodeURIComponent("random_iv"))),
    value: btoa(unescape(encodeURIComponent(JSON.stringify(data)))),
    mac: btoa(unescape(encodeURIComponent("fake_mac"))),
    tag: "",
  };
  return btoa(JSON.stringify(payload));
};

export default encodeComplexData;
