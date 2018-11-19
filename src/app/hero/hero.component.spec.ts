import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';



describe('Hero component', () => {

    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        // TestBed => Test component and template together
        // ConfigureTestingModule => Creates a module
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroComponent);
    });

    it('Should have hero', () => {
        fixture.componentInstance.hero = {
            id: 1,
            name: 'Superdude',
            strength: 3
        }
        expect(fixture.componentInstance.hero.name).toEqual('Superdude')
    })

    // Test the bindings
    // * This is an integration shallow test 
    it('Should have hero', () => {
        fixture.componentInstance.hero = {
            id: 1,
            name: 'Superdude',
            strength: 3
        }
        fixture.autoDetectChanges();

        /* *
        *  Shallow test using debugElement -- Better
        */
        let el = fixture.debugElement.query(By.css('a'));
        // debugElement  => is a wrapper around the dom element
        expect(el.nativeElement.textContent).toContain('Superdude')

        /* *
       *  Shallow test using nativeElement -- Ok
       */

        expect(fixture.nativeElement.querySelector('a').textContent).toContain('Superdude')
    })

});