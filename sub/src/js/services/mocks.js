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
      { "id": 2, "question": 1, content: 'this is my answer?' },
      { "id": 3, "question": 3, rating: 4 },
      { "id": 4, "question": 5, content: 'this is my answer?', rating: 8 }
    ]
  });

  // --------------  Notes  --------------
  $.mockjax({
    url: '/interviews/4/notes',
    responseText: {
      id: 42,
      content: 'My notes'
    }
  });

  // --------------  Events  --------------
  $.mockjax({
    url: '/interviews/4/events',
    responseText: [
      {id: 1, type: 'QUESTION_SELECTED', content: {question_id: 1}},
      {id: 2, type: 'ANSWER_UPDATE', content: {content: 'this is my answer ?', question_id: 1}},
      {id: 3, type: 'ANSWER_RATE', content: {rating: 3, question_id: 1}},
      {id: 4, type: 'RATED_UPDATE', content: {new_rating: 9, old_rating: 6, question_id: 1}}
    ]
  });
});