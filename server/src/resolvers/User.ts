import { Resolver, Arg, Query, Ctx } from "type-graphql";

@Resolver()
export class UserResolver {
    @Query(_returns => String)
    async returnHello(@Arg("name") name: string, @Ctx() _ctx: any){
      return `Hello ${name}`;
    };
}