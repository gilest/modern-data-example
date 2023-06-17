import { rest } from 'msw';

const articlesResponse = {
  links: {
    self: 'http://example.com/articles',
    next: 'http://example.com/articles?page[offset]=2',
    last: 'http://example.com/articles?page[offset]=10',
  },
  data: [
    {
      type: 'articles',
      id: '1',
      attributes: {
        title: 'JSON:API paints my bikeshed!',
      },
      relationships: {
        author: {
          links: {
            self: 'http://example.com/articles/1/relationships/author',
            related: 'http://example.com/articles/1/author',
          },
          data: { type: 'people', id: '9' },
        },
        comments: {
          links: {
            self: 'http://example.com/articles/1/relationships/comments',
            related: 'http://example.com/articles/1/comments',
          },
          data: [{ type: 'comments', id: '12' }],
        },
      },
      links: {
        self: 'http://example.com/articles/1',
      },
    },
  ],
  included: [
    {
      type: 'people',
      id: '9',
      attributes: {
        firstName: 'Dan',
        lastName: 'Gebhardt',
        twitter: 'dgeb',
      },
      links: {
        self: 'http://example.com/people/9',
      },
    },
    {
      type: 'comments',
      id: '12',
      attributes: {
        body: 'I like XML better',
      },
      relationships: {
        author: {
          data: { type: 'people', id: '9' },
        },
      },
      links: {
        self: 'http://example.com/comments/12',
      },
    },
  ],
};

export const handlers = [
  rest.get('http://example.com/articles', (_req, res, ctx) => {
    return res(ctx.json(articlesResponse));
  }),
];
