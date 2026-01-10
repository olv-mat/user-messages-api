/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { validate } from 'class-validator';
import { makeRegisterDto } from 'src/common/tests/factories/register-dto.factory';

describe('RegisterDto', () => {
  it('should accept when valid', async () => {
    const dto = makeRegisterDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('name', () => {
    it('should fail if empty', async () => {
      const dto = makeRegisterDto({ name: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail if not a string', async () => {
      const dto = makeRegisterDto({ name: 123 as any });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail if contains only spaces', async () => {
      const dto = makeRegisterDto({ name: '  ' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints).toHaveProperty('matches');
    });
  });

  describe('email', () => {
    it('should fail if empty', async () => {
      const dto = makeRegisterDto({ email: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail if not a valid email', async () => {
      const dto = makeRegisterDto({ email: 'email' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });
  });

  describe('password', () => {
    it('should fail if empty', async () => {
      const dto = makeRegisterDto({ password: '' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail if the password is weak', async () => {
      const dto = makeRegisterDto({ password: '123' });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('isStrongPassword');
    });
  });
});
