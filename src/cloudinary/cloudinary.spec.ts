import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryProvider } from './cloudinary.provider';

describe('Cloudinary', () => {
  let provider: CloudinaryProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryProvider],
    }).compile();

    provider = module.get<CloudinaryProvider>(CloudinaryProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
