import Usuario from "../usuarios/usuarios.entity";

export class InitialSeed {
  public static async startSeed() {
    const usuarios = [];
    await Promise.all(
      usuarios.map(usuario => {
        return Usuario.create(usuario);
      })
    );
  }
}
