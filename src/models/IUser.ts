// модель пользователя
export interface IUser {
  id: number;
  email: string;
  password: string;
  fio: string;
  roles: string[];
  places: string[];
}
