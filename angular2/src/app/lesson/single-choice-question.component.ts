import { Component, Input, OnInit }  from '@angular/core';
import { LessonContentComponent } from './lesson-content.component';
import * as _ from "lodash";

@Component({
  host: {
    '(document:keypress)': 'handleKeyboardEvent($event)'
  },
  template: `
    <div class="les-wrapper">
      <div class="les-choice">
        <div class="row">
          <div class="col-xs-12 col-md-4">
            <div class="containerr" style="margin-bottom: 35px">
              <div class="ct-card">
                <div class="front" id="animation3" style="border-radius: 15px;">
                  <div>
                    <img src="{{data.current_card.picture.url}}" onError="this.src='./assets/images/card-demo.jpg';" style="width: 75%;margin-top: 15px;margin-bottom: 8px;">
                  </div>
                   <div style="overflow:auto;height: 82px;">
                    <span style="word-wrap: break-word"> {{data.current_card.front}} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-md-8">
            <div class="answers">
              <ul>
                <li class="list-ans" *ngFor="let answer of answers" >
                  <button (click)="continue(answer)" [innerHtml]="answer"></button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./lesson.component.css']
})
export class SingleChoiceQuestionComponent implements LessonContentComponent, OnInit {
  @Input() data: any;
  parent: any;
  lessons = [];
  cards = [];
  current_card: any;
  answers = [];
  is_first = true;

  ngOnInit() {
    this.current_card = this.data.current_card
    this.cards =  _.cloneDeep(this.data.cards);
    this.answers = this.randomAnswers(this.current_card, this.cards);
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (/[1-9]/.test(event.key)) {
      event.preventDefault();
      let answer = this.answers[_.toNumber(event.key) - 1];
      if (typeof answer !== 'undefined') {
        this.continue(answer);
      }
    }
  }

  continue(answer){
    if (this.current_card.back == answer) {
      console.log("Right");
      document.getElementById('animation3').classList.remove("false-animation");
      document.getElementById('animation3').classList.add("true-animation");
      if (this.is_first) {
        this.parent.lessonPracticeService.single_question_success(this.current_card);
      }
      _.delay(this.parent.nextCard.bind(this.parent), 1000);
    } else {
      document.getElementById('animation3').classList.add("false-animation");
      _.delay(function () {
        document.getElementById('animation3').classList.remove("false-animation")
      }, 1000, 'later');
      console.log("Wrong");
    }
    this.is_first = false;
  }

  randomAnswers(card, cards){
    var answers = []
    if (cards.length == 2) {
      var otherCard =  _.find(cards, function(o) { return card !=o ; });
      answers.push(otherCard.front, otherCard.back);
    }
    if (cards.length >= 3) {
      var other_cards = _.reject(cards, function(o) { return o.id == card.id; });
      var limited = _.sampleSize(other_cards, 2);
      answers = _.map(limited, 'back');
    }
    answers.push(card.back)
    return _.shuffle(answers)
  }
}
