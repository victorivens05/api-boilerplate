import { Component, HttpStatus } from '@nestjs/common'
import { IQueryParams } from './query-params.interface'
import { Sequelize } from 'sequelize-typescript'
import * as nodemailer from 'nodemailer'

@Component()
export class UtilService {

  /** Cria um objeto para a paginação a partir de query params
   * @param queryParams
   */
  public static getQueryParams(queryParams: IQueryParams) {
    const opts: any = {}
    if (!queryParams) return {}
    if (queryParams.order) {
      const stringLiteral = this.getOrderByString(queryParams.order, queryParams.orderBy, queryParams.orderByEntity)
      opts.order = Sequelize.literal(stringLiteral)
    }

    if (queryParams.offset) opts.offset = +queryParams.offset
    if (queryParams.limit) opts.limit = +queryParams.limit

    return opts

  }

  private static getOrderByString(order: string, orderBy: string = 'ASC', orderByEntity?: string): string {
    const charInit = process.env.NODE_ENV === 'production' ? '[' : '`'
    const charEnd = process.env.NODE_ENV === 'production' ? ']' : '`'
    const stringLiteral = [charInit, orderBy, charEnd, ' ', order.toUpperCase()].join('')
    if (orderByEntity)
      return [charInit, orderByEntity, charEnd, '.'].join('') + stringLiteral

    return stringLiteral
  }

  public static getProcedureParams(...args: any[]) {
    return args.map(x => {
      if (x == null) return 'null'
      if (isNaN(x) || x === '') return `'${x.replace(/\'/g, '\'\'')}'`
      return x
    }).join(', ')
  }

  public static enviaEmail(email: string, assunto: string, mensagemHtml: string, mensagem: string, bcc: string = ''): Promise<true | any> {

    const transporter = nodemailer.createTransport({
      host: 'SMTP.office365.com',
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      tls: {
        ciphers: 'SSLv3',
      },
      secure: false,
      debug: true,
      auth: {
        user: 'contato@hyperpay.com.br',
        pass: 'Cob51623',
      },
    })

    // setup email data with unicode symbols
    const mailOptions = {
      from: '"Contato NexBoard" <contato@hyperpay.com.br>', // sender address
      to: email,
      subject: assunto,
      text: mensagem,
      html: mensagemHtml,
      bcc,
    }

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return reject(error)
        resolve(true)
      })
    })

  }

}

