import { createRouteParamDecorator } from '@nestjs/common'

export const User = createRouteParamDecorator((data, req) => {
  return req.user
})

export const UserId = createRouteParamDecorator((data, req) => {
  if (req.user) return req.user.id
  return null
})

