define(['jquery', 'jquery.mockjax'], function ($, mockjax) {
  // --------------  Files  --------------
  $.mockjax({
    url: "/files/2",
    responseText: {
      "id": 1,
      "type": "JobSpec",
      "size": 35,
      "original_name" : "test.pdf",
      "url": "http://static.googleusercontent.com/media/research.google.com/ro//archive/bigtable-osdi06.pdf",
      "delete_type": "DELETE",
      "delete_url": "/dashboard/files/1",
      "name": "_1.pdf"
    }
  });

  $.mockjax({
    url: "/files/75",
    responseText: {
      "id": 1,
      "type": "CV",
      "size": 35,
      "original_name" : "test.pdf",
      "url": "https://www.openssl.org/~bodo/ssl-poodle.pdf",
      "delete_type": "DELETE",
      "delete_url": "/dashboard/files/1",
      "name": "_1.pdf"
    }
  });

  // --------------  Answers  --------------
  $.mockjax({
    url: '/interviews/4/answers',
    responseText: [
      { "id": 2, "question": 1 },
      { "id": 4, "question": 3 },
      { "id": 8, "question": 5 },
      { "id": 9, "question": 6 },
      { "id": 10, "question": 7 }
    ]
  });
});