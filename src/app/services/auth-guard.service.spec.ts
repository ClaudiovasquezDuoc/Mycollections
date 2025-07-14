import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

class SQLiteMock {
  create() { return Promise.resolve({}); }
}

describe('AuthGuard', () => {
  let service: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SQLite, useClass: SQLiteMock }
      ]
    });
    service = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
