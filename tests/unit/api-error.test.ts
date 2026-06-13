import { ApiError } from '../../src/lib/api-error';

describe('ApiError Mapping', () => {
  it('should map badRequest to 400', () => {
    const error = ApiError.badRequest('Invalid format');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Invalid format');
  });

  it('should map unauthorized to 401', () => {
    const error = ApiError.unauthorized();
    expect(error.statusCode).toBe(401);
  });

  it('should map notFound to 404', () => {
    const error = ApiError.notFound('Goal not found');
    expect(error.statusCode).toBe(404);
  });

  it('should map internal to 500', () => {
    const error = ApiError.internal();
    expect(error.statusCode).toBe(500);
  });
});
