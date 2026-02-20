import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIButtonComponent } from '../button/button.component';
import { UIInputComponent } from '../forms/input/input.component';

@Component({
  selector: 'lib-ui-components-gaming-variants-showcase',
  standalone: true,
  imports: [CommonModule, UIButtonComponent, UIInputComponent],
  templateUrl: './gaming-variants-showcase.component.html',
  styleUrl: './gaming-variants-showcase.component.scss',
})
export class UIGamingVariantsShowcaseComponent {
  // List of gaming variants with their display names and descriptions
  gamingVariants = [
    {
      id: 'pokemon',
      displayName: 'Pokémon',
      description: 'Classic Pokéball aesthetic with red and white colors',
      franchise: 'Nintendo',
      year: '1996'
    },
    {
      id: 'animal-crossing',
      displayName: 'Animal Crossing',
      description: 'Cozy pastoral aesthetic with wooden textures',
      franchise: 'Nintendo',
      year: '2001'
    },
    {
      id: 'assassins-creed',
      displayName: 'Assassin\'s Creed',
      description: 'Stealthy assassin aesthetic with red accents',
      franchise: 'Ubisoft',
      year: '2007'
    },
    {
      id: 'far-cry',
      displayName: 'Far Cry',
      description: 'Jungle survival aesthetic with green camouflage',
      franchise: 'Ubisoft',
      year: '2004'
    },
    {
      id: 'watch-dogs',
      displayName: 'Watch Dogs',
      description: 'Hacker aesthetic with digital distortion effects',
      franchise: 'Ubisoft',
      year: '2014'
    },
    {
      id: 'bioshock-enhanced',
      displayName: 'Bioshock Enhanced',
      description: 'Underwater Art Deco aesthetic with enhanced effects',
      franchise: '2K Games',
      year: '2007'
    },
    {
      id: 'lol',
      displayName: 'League of Legends',
      description: 'Summoner\'s Rift battle aesthetic with team colors',
      franchise: 'Riot Games',
      year: '2009'
    },
    {
      id: 'overwatch',
      displayName: 'Overwatch',
      description: 'Hero-based team shooter aesthetic',
      franchise: 'Blizzard',
      year: '2016'
    },
    {
      id: 'minecraft',
      displayName: 'Minecraft',
      description: 'Blocky pixelated aesthetic with dirt textures',
      franchise: 'Mojang',
      year: '2011'
    },
    {
      id: 'fortnite',
      displayName: 'Fortnite',
      description: 'Battle Royale aesthetic with vibrant colors',
      franchise: 'Epic Games',
      year: '2017'
    },
    {
      id: 'super-meat-boy',
      displayName: 'Super Meat Boy',
      description: 'Retro platformer aesthetic with red and bloody theme',
      franchise: 'Team Meat',
      year: '2010'
    },
    {
      id: 'donkeykong',
      displayName: 'Donkey Kong',
      description: 'Classic arcade aesthetic with barrel and jungle theme',
      franchise: 'Nintendo',
      year: '1981'
    },
    {
      id: 'supermeatboy',
      displayName: 'Supermeatboy',
      description: 'Alternative name for Super Meat Boy variant',
      franchise: 'Team Meat',
      year: '2010'
    }
  ];

  // Sample input values for demonstration
  inputValues: Record<string, string> = {
    pokemon: 'Pikachu',
    'animal-crossing': 'Peaches',
    'assassins-creed': 'Ezio Auditore',
    'far-cry': 'Jungle Outpost',
    'watch-dogs': 'ctOS Access Code',
    'bioshock-enhanced': 'Plasmid Code',
    lol: 'Summoner Name',
    overwatch: 'Battle Tag',
    minecraft: 'Diamond Pickaxe',
    fortnite: 'Epic Username',
    'super-meat-boy': 'Meat Boy',
    donkeykong: 'Jumpman',
    supermeatboy: 'Meat Boy'
  };

  // Handle button click events
  onButtonClick(variantId: string) {
    console.log(`Button clicked with variant: ${variantId}`);
    alert(`You selected the ${variantId} variant!`);
  }

  // Get input placeholder for each variant
  getInputPlaceholder(variantId: string): string {
    const variant = this.gamingVariants.find(v => v.id === variantId);
    return `Enter ${variant?.displayName} data...`;
  }
}
