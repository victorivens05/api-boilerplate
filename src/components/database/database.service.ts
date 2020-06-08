import { Component, Inject } from '@nestjs/common'
import { Transaction, Sequelize } from 'sequelize'

@Component()
export class DatabaseService {

  constructor(@Inject('SequelizeToken') public sequelize: Sequelize) { }

  /** Cria uma nova transação
   */
  async startTransaction(): Promise<any> {
    return await this.sequelize.transaction()
  }

  /** Efetua o commit de uma transação
   * @param t
   */
  async commitTransaction(t: Transaction): Promise<void> {
    await t.commit()
  }

  /** Efetua o rollback de uma transação
   * @param t
   */
  async rollbackTransaction(t: Transaction): Promise<void> {
    await t.rollback()
  }

  select(sql: string): Promise<any> {
    return (this.sequelize.query(sql, { type: this.sequelize.QueryTypes.SELECT }) as any)
  }

  query(sql: string) {
    return this.sequelize.query(sql)
  }

  async execProcedure(sql: string): Promise<{ success: boolean, msg?: string, result?: number }> {
    const resultado = await this.sequelize.query(sql).spread((results, metadata) => {
      return results
    })

    if (resultado[0].Ret === 0)
      return { success: false, msg: resultado[0].Msg }

    return { success: true, result: resultado[0].Ret }
  }

}

