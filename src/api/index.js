const API_ENDPOINT = "https://my-json-server.typicode.com/jaewoong2/Fake_api/";

const request = (id = 1) => {
  const data = fetch(API_ENDPOINT + id, {
    method: "GET",
  }).then((res) => res.json());

  return data;
};

export default request;
