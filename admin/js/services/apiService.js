app.factory("apiService", [
  "$http",
  function ($http) {
    const baseUrl = "http://localhost:3001";

    const mergeConfig = (userConfig) => {
      const defaultHeaders = {
      };

      return {
        ...userConfig,
        headers: {
          ...defaultHeaders,
          ...userConfig?.headers,
        },
      };
    };

    return {
      get: function (endpoint, config = {}) {
        return $http.get(baseUrl + endpoint, mergeConfig(config));
      },
      post: function (endpoint, data, config = {}) {
        return $http.post(baseUrl + endpoint, data, mergeConfig(config));
      },
      put: function (endpoint, data, config = {}) {
        return $http.put(baseUrl + endpoint, data, mergeConfig(config));
      },
      delete: function (endpoint, config = {}) {
        return $http.delete(baseUrl + endpoint, mergeConfig(config));
      },
    };
  },
]);
