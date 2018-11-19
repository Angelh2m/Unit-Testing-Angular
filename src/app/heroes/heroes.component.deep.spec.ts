/* *
*  TEST OF A COMPONENT WITH CHILD COMPONENTS AND SERVICE DEPENDENCIES
*  MOCK SERVICE
*  MOCK CHILD COMPONENTS
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { NO_ERRORS_SCHEMA, Input, Component, Directive } from '@angular/core';
import { HeroService } from '../hero.service';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { By } from '@angular/platform-browser';
import { HeroComponent } from '../hero/hero.component';

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})

class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}


describe('Heros Component(Deep test)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wondeful Woman', strength: 24 },
            { id: 3, name: 'Super Dude', strength: 55 },
        ]

        // Mock the service
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                {
                    provide: HeroService,
                    useValue: mockHeroService
                }
            ],
            // schemas: [NO_ERRORS_SCHEMA]

        })
        fixture = TestBed.createComponent(HeroesComponent);

    });

    it('Should render each hero as HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES))
        fixture.detectChanges();

        const heroComponentsDes = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentsDes.length).toEqual(3);
        for (let i = 0; i < heroComponentsDes.length; i++) {
            expect(heroComponentsDes[i].componentInstance.hero).toEqual(HEROES[i])
        }
        // console.log(heroComponentsDes[0].componentInstance.hero);

        // expect(fixture.componentInstance.heroes.length).toBe(3)
    });

    /* *
    *  UNIt TEST CLICK EVENT - Way one
    * .triggerEventHandler('click', { stopPropagation: () => { } });
    */
    it('should call heroservice.deletehero', () => {

        spyOn(fixture.componentInstance, 'delete')

        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent))
        heroComponents[0].query(By.css('button'))
            .triggerEventHandler('click', { stopPropagation: () => { } });

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0])
    });

    /* *
    *  UNIT TEST METHODS FROM CHILDREN  - Way Two\
    * (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined)
    */

    it('should call heroservice.deletehero', () => {

        spyOn(fixture.componentInstance, 'delete')

        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined)
        // .triggerEventHandler('click', { stopPropagation: () => { } });
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0])
    });

    /* *
    *  UNIT TEST METHODS FROM CHILDREN  - Way three
    * .triggerEventHandler('delete', null)
    */

    it('should call heroservice.deletehero', () => {

        spyOn(fixture.componentInstance, 'delete')

        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponents[0].triggerEventHandler('delete', null)
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0])
    });


    /* *
    *  Test input fields
    */

    it('should test and input field', () => {

        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const name = "Mr Ice";

        mockHeroService.addHero.and.returnValue(of({ id: 5, name: 'Mr ice', strength: 4 }));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        addButton.triggerEventHandler('click', null)
        fixture.detectChanges();

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.texContent;
        // expect(heroText).toContain("Mr")
    });

    it('Should have the correct route for the first hero', () => {

        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const heroComponents = fixture.debugElement
            .queryAll(By.directive(HeroComponent));

        let routerLink = heroComponents[0]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub)

        heroComponents[0]
            .query(By.css('a')).triggerEventHandler('click', null)

        expect(routerLink.navigatedTo).toBe('/detail/1');

    })


})
