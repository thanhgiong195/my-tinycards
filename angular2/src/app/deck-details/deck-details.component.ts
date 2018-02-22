import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Deck } from '../deck';
import { DecksService } from '../services/decks.service';

@Component({
  selector: 'app-deck-details',
  templateUrl: './deck-details.component.html',
  styleUrls: ['./deck-details.component.css']
})
export class DeckDetailsComponent implements OnInit {
  deck: Deck;
  sub: any;
  cards = [];
  menuOpen = false;
  lessons = [];

  constructor(private decksService: DecksService,
    private route: ActivatedRoute,
    private router: Router
   ) {}

  ngOnInit() {
    const self = this;
    this.sub = this.route.params.subscribe(params => {
      let id = Number.parseInt(params['id']);
      console.log('getting person with id: ', id);
      this.decksService
        .get(id)
        .subscribe(p => {
          this.deck = p;
          self.lessons = p.lessons;
        }
      )
    });
  }

  flipped($event){
    this.menuOpen = !this.menuOpen;
  }

  click_lesson(id){
    const self = this;
       this.decksService
        .get_lesson(id)
        .subscribe(function(p){ 
          self.randomAnswers(p.cards[0], p.cards);
          self.cards = p.cards;
        })
    return self.cards;
  }

  randomAnswers(card, cards){
    var answers = []
    answers.push(card.back)
    if (cards.length == 2) {
      var otherCard = this.getOtherCard(cards, card);
      answers.push(otherCard.front, otherCard.back);
    }
    if (cards.length >= 3) {
      answers = this.getRandomCards(cards, card);
    }
    return answers;
  }

  getOtherCard(cards, card) {
    for (var i = cards.length-1; i > 0; i--) {
      if (cards[i] != card) {
        return cards[i];
      }
    }
  }

  getRandomCards(cards, card) {
    // cards = cards.splice(this.getPosition(cards, card), 1);
    var answers = [];
    var position = this.getRandomPosition(cards);
    answers.push(cards[position].back);
    cards = cards.splice(position, 1);
    position = this.getRandomPosition(cards);
    answers.push(cards[position].back);
    return answers;
  }

  getRandomPosition(cards) {
    var len = cards.length;
    var position = Math.floor(Math.random() * len);
    return position;
  }

  getPosition(cards, card) {
    for (var i = cards.length - 1; i >= 0; i--) {
      if (cards[i].id == card.id) {
        return i;
      }
    }
  }

}
