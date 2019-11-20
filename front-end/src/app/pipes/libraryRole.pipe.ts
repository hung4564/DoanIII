import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "libraryRole"
})
export class LibraryRolePipe implements PipeTransform {
  transform(value: string, args?: any): any {
    return value.replace("Site", "");
  }
}
