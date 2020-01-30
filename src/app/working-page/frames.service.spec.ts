import { TestBed } from '@angular/core/testing';

import { FramesService } from './frames.service';

describe('FramesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FramesService = TestBed.get(FramesService);
    expect(service).toBeTruthy();
  });
});
